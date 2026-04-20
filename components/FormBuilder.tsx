"use client";

import {
  coerceFormContentDocument,
  FormBuilderDocument,
  parseFormContentDocument,
  serializeFormContentDocument,
} from "@/lib/forms";
import Designer from "./Designer";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DragOverlayWrapper from "./DragOverlayWrapper";
import { ReactNode, useEffect, useState } from "react";
import useDesigner from "./hooks/useDesigner";
import { FormElementSidebarGroup, FormElementsRegistry } from "./FormElements";
import { FormElementsProvider } from "./context/FormElementsContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import FormSubmitComponent from "./FormSubmitComponent";
import { FormBuilderSettings } from "@/lib/form-builder-settings";
import { FormPageDocument } from "@/lib/form-pages";
import { cn } from "@/lib/utils";

type FormBuilderProps = {
  form: FormBuilderDocument;
  toolbar?: ReactNode;
  publishedView?: ReactNode;
  registry?: FormElementsRegistry;
  sidebarGroups?: FormElementSidebarGroup[];
};

function formatSurveyJson(
  settings: FormBuilderSettings,
  pages: FormPageDocument[],
) {
  return JSON.stringify(
    {
      version: 1,
      settings,
      pages,
    },
    null,
    2,
  );
}

function FormPreview({
  form,
  registry,
  sidebarGroups,
}: {
  form: FormBuilderDocument;
  registry?: FormElementsRegistry;
  sidebarGroups?: FormElementSidebarGroup[];
}) {
  const { pages, settings } = useDesigner();

  return (
    <FormSubmitComponent
      formUrl={form.shareURL}
      formName={form.name}
      formDescription={form.description}
      settings={settings}
      pages={pages}
      previewMode
      registry={registry}
      sidebarGroups={sidebarGroups}
      onSubmit={async () => undefined}
    />
  );
}

function JsonEditorPanel() {
  const {
    pages,
    settings,
    setPages,
    setSettings,
    setSelectedElement,
    setActivePageId,
  } = useDesigner();
  const [draft, setDraft] = useState(() => formatSurveyJson(settings, pages));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setDraft(formatSurveyJson(settings, pages));
    setErrorMessage(null);
  }, [pages, settings]);

  const applyJsonChanges = () => {
    try {
      const parsed = coerceFormContentDocument(JSON.parse(draft) as unknown);

      setSelectedElement(null);
      setPages(parsed.pages);
      setSettings(parsed.settings);
      setActivePageId(parsed.pages[0]?.id ?? null);
      setDraft(formatSurveyJson(parsed.settings, parsed.pages));
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Invalid survey JSON.",
      );
    }
  };

  const resetDraft = () => {
    setDraft(formatSurveyJson(settings, pages));
    setErrorMessage(null);
  };

  return (
    <div className="flex h-full w-full justify-center overflow-y-auto p-6 md:p-10">
      <div className="flex w-full max-w-[920px] flex-col gap-4 rounded-3xl border border-border/60 bg-background/95 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold">JSON Editor</h3>
            <p className="text-sm text-muted-foreground">
              Edit the survey model directly. Save persists both layout settings
              and pages.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={resetDraft}>
              Reset
            </Button>
            <Button onClick={applyJsonChanges}>Apply changes</Button>
          </div>
        </div>
        {errorMessage && (
          <Alert variant="destructive">
            <AlertTitle>Invalid schema</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          spellCheck={false}
          className="min-h-[520px] font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Current serialized size:{" "}
          {serializeFormContentDocument({ settings, pages }).length} characters.
        </p>
      </div>
    </div>
  );
}

function BuilderWorkspace({
  form,
  toolbar,
  registry,
  sidebarGroups,
}: {
  form: FormBuilderDocument;
  toolbar?: ReactNode;
  registry?: FormElementsRegistry;
  sidebarGroups?: FormElementSidebarGroup[];
}) {
  const [activeTab, setActiveTab] = useState("designer");

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 300, tolerance: 5 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <main className="flex h-full min-h-0 w-full flex-col overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex min-h-0 min-w-0 flex-1 flex-col"
      >
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b-2 p-4">
          <TabsList>
            <TabsTrigger value="designer">Designer</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="json">JSON Editor</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">{toolbar}</div>
        </div>
        <div
          className={cn(
            "relative m-4 mt-4 flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-border/60",
            activeTab === "designer"
              ? "bg-accent bg-[url(/arangeboard.svg)] dark:bg-[url(/arangeboard-dark.svg)]"
              : activeTab === "preview"
                ? "bg-background"
                : "bg-muted/20",
          )}
        >
          <TabsContent
            value="designer"
            className="mt-0 h-full min-h-0 w-full overflow-hidden"
          >
            <DndContext sensors={sensors}>
              <div className="h-full min-h-0">
                <Designer formName={form.name} />
              </div>
              <DragOverlayWrapper />
            </DndContext>
          </TabsContent>
          <TabsContent
            value="preview"
            className="mt-0 h-full min-h-0 w-full overflow-y-auto bg-background"
          >
            <FormPreview
              form={form}
              registry={registry}
              sidebarGroups={sidebarGroups}
            />
          </TabsContent>
          <TabsContent
            value="json"
            className="mt-0 h-full min-h-0 w-full overflow-y-auto bg-muted/20"
          >
            <JsonEditorPanel />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}

function FormBuilder({
  form,
  toolbar,
  publishedView,
  registry,
  sidebarGroups,
}: FormBuilderProps) {
  const { setPages, setSettings, setActivePageId, setSelectedElement } =
    useDesigner();

  useEffect(() => {
    setPages(form.pages);
    setSettings(form.settings);
    setActivePageId(form.pages[0]?.id ?? null);
    setSelectedElement(null);
  }, [
    form.pages,
    form.settings,
    setPages,
    setSettings,
    setActivePageId,
    setSelectedElement,
  ]);

  if (form.published) {
    return <>{publishedView}</>;
  }

  return (
    <FormElementsProvider registry={registry} sidebarGroups={sidebarGroups}>
      <BuilderWorkspace
        form={form}
        toolbar={toolbar}
        registry={registry}
        sidebarGroups={sidebarGroups}
      />
    </FormElementsProvider>
  );
}

export default FormBuilder;
