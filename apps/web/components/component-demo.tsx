"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

const frameworks = [
  { label: "Select a framework", value: null },
  { label: "Next.js", value: "next" },
  { label: "Vite", value: "vite" },
  { label: "Astro", value: "astro" },
];

export const ComponentDemo = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <Label htmlFor="project-name">Project name</Label>
      <Input defaultValue="my-app" id="project-name" placeholder="my-app" />
    </div>

    <div className="flex flex-col gap-2">
      <Label htmlFor="framework">Framework</Label>
      <Select defaultValue="next" items={frameworks}>
        <SelectTrigger aria-label="Framework" className="w-full" id="framework">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {frameworks.map((item) =>
              item.value === null ? null : (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              )
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <Dialog>
      <DialogTrigger render={<Button />}>Open dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Base UI dialog</DialogTitle>
          <DialogDescription>
            Shared components from{" "}
            <code className="font-mono text-xs">@workspace/ui</code> use Base UI
            primitives and the monorepo design tokens.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  </div>
);
