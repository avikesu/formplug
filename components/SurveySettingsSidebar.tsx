"use client";

import useDesigner from "./hooks/useDesigner";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function SurveySettingsSidebar() {
  const { settings, updateSettings } = useDesigner();

  return (
    <div className="flex flex-col gap-6 p-2">
      <div>
        <p className="text-sm text-foreground/70">Survey properties</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Control how the survey is aligned and displayed in Preview and on the
          public submit page.
        </p>
      </div>
      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
          <div>
            <Label className="text-sm font-medium">Show header</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Display the survey title and description above the fields.
            </p>
          </div>
          <Switch
            checked={settings.showHeader}
            onCheckedChange={(checked) =>
              updateSettings({ showHeader: checked })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Survey width</Label>
          <Select
            value={settings.width}
            onValueChange={(value) =>
              updateSettings({ width: value as typeof settings.width })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select width" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="narrow">Narrow page</SelectItem>
              <SelectItem value="regular">Regular page</SelectItem>
              <SelectItem value="wide">Wide page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Horizontal alignment</Label>
          <Select
            value={settings.alignment}
            onValueChange={(value) =>
              updateSettings({ alignment: value as typeof settings.alignment })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select alignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Align left</SelectItem>
              <SelectItem value="center">Align center</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Surface style</Label>
          <Select
            value={settings.surfaceStyle}
            onValueChange={(value) =>
              updateSettings({
                surfaceStyle: value as typeof settings.surfaceStyle,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select surface style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="soft">Soft</SelectItem>
              <SelectItem value="outline">Outlined</SelectItem>
              <SelectItem value="elevated">Elevated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default SurveySettingsSidebar;
