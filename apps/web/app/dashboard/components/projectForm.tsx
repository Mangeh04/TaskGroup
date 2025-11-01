import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function ProjectForm() {
  return (
    <>
      <Label htmlFor="project-name">Project Name</Label>
      <Input
        id="project-name"
        name="Project Name"
        placeholder="Incredible Project"
      />
      <Label htmlFor="project-description">Description</Label>
      <Input
        id="project-description"
        name="Project Description"
        placeholder="Description of the project"
      />
    </>
  );
}