"use client";

import useDesigner from "./hooks/useDesigner";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

function ColorSettingField({
  label,
  value,
  onChange,
  fallbackColor = "#ffffff",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  fallbackColor?: string;
}) {
  const colorPickerValue = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)
    ? value
    : fallbackColor;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-background px-3 py-2">
        <Input
          type="color"
          value={colorPickerValue}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-14 shrink-0 cursor-pointer border-0 bg-transparent p-0"
        />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Default"
        />
      </div>
    </div>
  );
}

function PagePropertiesSidebar() {
  const { activePage, updateCurrentPage } = useDesigner();

  if (!activePage) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 p-2">
      <div>
        <p className="text-sm text-foreground/70">Page properties</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Configure the current page layout, content, visibility, and runtime
          parameters.
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="general" className="flex flex-1 flex-col gap-4">
        <div className="rounded-2xl border border-border/70 bg-muted/30 p-2">
          <TabsList className="grid h-auto w-full grid-cols-3 gap-2 bg-transparent p-0">
            <TabsTrigger
              value="general"
              className="min-h-10 rounded-xl border border-transparent px-3"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="layout"
              className="min-h-10 rounded-xl border border-transparent px-3"
            >
              Layout
            </TabsTrigger>
            <TabsTrigger
              value="conditional"
              className="min-h-10 rounded-xl border border-transparent px-3"
            >
              Conditional
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="general"
          className="mt-0 rounded-2xl border border-border/70 bg-background p-4"
        >
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground">General</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Basic page metadata and page-level visibility controls.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label>Page name</Label>
                <Badge variant={activePage.showName ? "secondary" : "outline"}>
                  {activePage.showName ? "Visible" : "Hidden"}
                </Badge>
              </div>
              <Input
                value={activePage.name}
                onChange={(event) =>
                  updateCurrentPage({ name: event.target.value })
                }
                placeholder="page1"
              />
              <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                <div>
                  <Label className="text-sm font-medium">Show page name</Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Hide or show the page name in the designer and form header.
                  </p>
                </div>
                <Switch
                  checked={activePage.showName}
                  onCheckedChange={(checked) =>
                    updateCurrentPage({ showName: checked })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label>Page title</Label>
                <Badge variant={activePage.showTitle ? "secondary" : "outline"}>
                  {activePage.showTitle ? "Visible" : "Hidden"}
                </Badge>
              </div>
              <Input
                value={activePage.title}
                onChange={(event) =>
                  updateCurrentPage({ title: event.target.value })
                }
                placeholder="Page title"
              />
              <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                <div>
                  <Label className="text-sm font-medium">Show page title</Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Hide or show the page title in preview and public forms.
                  </p>
                </div>
                <Switch
                  checked={activePage.showTitle}
                  onCheckedChange={(checked) =>
                    updateCurrentPage({ showTitle: checked })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label>Description</Label>
                <Badge
                  variant={activePage.showDescription ? "secondary" : "outline"}
                >
                  {activePage.showDescription ? "Visible" : "Hidden"}
                </Badge>
              </div>
              <Textarea
                rows={3}
                value={activePage.description}
                onChange={(event) =>
                  updateCurrentPage({ description: event.target.value })
                }
                placeholder="Short helper text under the page title"
              />
              <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                <div>
                  <Label className="text-sm font-medium">
                    Show description
                  </Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Hide or show the page description in preview and public
                    forms.
                  </p>
                </div>
                <Switch
                  checked={activePage.showDescription}
                  onCheckedChange={(checked) =>
                    updateCurrentPage({ showDescription: checked })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
              <div>
                <Label className="text-sm font-medium">Visible</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Hide or show this page in preview and on the public form.
                </p>
              </div>
              <Switch
                checked={activePage.visible}
                onCheckedChange={(checked) =>
                  updateCurrentPage({ visible: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
              <div>
                <Label className="text-sm font-medium">Read-only</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Show the page content without allowing edits on this step.
                </p>
              </div>
              <Switch
                checked={activePage.readOnly}
                onCheckedChange={(checked) =>
                  updateCurrentPage({ readOnly: checked })
                }
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="layout"
          className="mt-0 rounded-2xl border border-border/70 bg-background p-4"
        >
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground">Layout</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Page sizing, surface styling, and spacing controls.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Page state</Label>
              <Select
                value={activePage.state}
                onValueChange={(value) =>
                  updateCurrentPage({ state: value as typeof activePage.state })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="expanded">Expanded</SelectItem>
                  <SelectItem value="collapsed">Collapsed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Width</Label>
              <Input
                value={activePage.width}
                onChange={(event) =>
                  updateCurrentPage({ width: event.target.value })
                }
                placeholder="100%"
              />
            </div>

            <div className="space-y-2">
              <Label>Min width</Label>
              <Input
                value={activePage.minWidth}
                onChange={(event) =>
                  updateCurrentPage({ minWidth: event.target.value })
                }
                placeholder="320px"
              />
            </div>

            <div className="space-y-2">
              <Label>Max width</Label>
              <Input
                value={activePage.maxWidth}
                onChange={(event) =>
                  updateCurrentPage({ maxWidth: event.target.value })
                }
                placeholder="960px"
              />
            </div>

            <div className="space-y-2">
              <Label>Grid layout columns</Label>
              <Textarea
                rows={3}
                value={activePage.gridLayoutColumns}
                onChange={(event) =>
                  updateCurrentPage({ gridLayoutColumns: event.target.value })
                }
                placeholder='[{ "width": "1fr" }, { "width": "1fr" }]'
              />
            </div>

            <Separator />

            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Appearance</p>
              <p className="text-xs leading-5 text-muted-foreground">
                Control how this page looks in both designer and preview.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ColorSettingField
                label="Canvas color"
                value={activePage.canvasBackgroundColor}
                fallbackColor="#f8fafc"
                onChange={(value) =>
                  updateCurrentPage({ canvasBackgroundColor: value })
                }
              />
              <ColorSettingField
                label="Page surface color"
                value={activePage.pageBackgroundColor}
                fallbackColor="#ffffff"
                onChange={(value) =>
                  updateCurrentPage({ pageBackgroundColor: value })
                }
              />
              <ColorSettingField
                label="Page header color"
                value={activePage.pageHeaderBackgroundColor}
                fallbackColor="#ffffff"
                onChange={(value) =>
                  updateCurrentPage({ pageHeaderBackgroundColor: value })
                }
              />
              <ColorSettingField
                label="Page border color"
                value={activePage.pageBorderColor}
                fallbackColor="#e2e8f0"
                onChange={(value) =>
                  updateCurrentPage({ pageBorderColor: value })
                }
              />
              <ColorSettingField
                label="Heading color"
                value={activePage.headingColor}
                fallbackColor="#0f172a"
                onChange={(value) => updateCurrentPage({ headingColor: value })}
              />
              <ColorSettingField
                label="Body text color"
                value={activePage.bodyTextColor}
                fallbackColor="#475569"
                onChange={(value) =>
                  updateCurrentPage({ bodyTextColor: value })
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Surface radius</Label>
                <Select
                  value={activePage.surfaceRadius}
                  onValueChange={(value) =>
                    updateCurrentPage({
                      surfaceRadius: value as typeof activePage.surfaceRadius,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select radius" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xl">XL</SelectItem>
                    <SelectItem value="2xl">2XL</SelectItem>
                    <SelectItem value="3xl">3XL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Surface shadow</Label>
                <Select
                  value={activePage.surfaceShadow}
                  onValueChange={(value) =>
                    updateCurrentPage({
                      surfaceShadow: value as typeof activePage.surfaceShadow,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select shadow" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="soft">Soft</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="strong">Strong</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Content padding</Label>
              <Input
                value={activePage.contentPadding}
                onChange={(event) =>
                  updateCurrentPage({ contentPadding: event.target.value })
                }
                placeholder="1.5rem"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="conditional"
          className="mt-0 rounded-2xl border border-border/70 bg-background p-4"
        >
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground">Conditional</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Expression-based rules that control visibility, enablement, and
              required state.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Visible if</Label>
              <Input
                value={activePage.visibleIf}
                onChange={(event) =>
                  updateCurrentPage({ visibleIf: event.target.value })
                }
                placeholder="{age} >= 18"
              />
            </div>

            <div className="space-y-2">
              <Label>Enable if</Label>
              <Input
                value={activePage.enableIf}
                onChange={(event) =>
                  updateCurrentPage({ enableIf: event.target.value })
                }
                placeholder="{consent} = true"
              />
            </div>

            <div className="space-y-2">
              <Label>Required if</Label>
              <Input
                value={activePage.requiredIf}
                onChange={(event) =>
                  updateCurrentPage({ requiredIf: event.target.value })
                }
                placeholder="{contactMe} = true"
              />
            </div>

            <div className="space-y-2">
              <Label>Required error text</Label>
              <Input
                value={activePage.requiredErrorText}
                onChange={(event) =>
                  updateCurrentPage({ requiredErrorText: event.target.value })
                }
                placeholder="Please answer at least one question on this page"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PagePropertiesSidebar;
