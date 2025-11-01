import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function TaskForm({ users }: { users: string[] }) {
  return (
    <>
      <Label htmlFor="task-name">Task name</Label>
      <Input
        id="task-name"
        name="Task Name"
        placeholder="Incredible Task"
      />
      <Label htmlFor="task-description">Task description</Label>
      <Input
        id="task-description"
        name="Task Description"
        placeholder="Description of the Task"
      />
      <Label htmlFor="task-user">Assigned User</Label>
      <div className="w-full flex flex-row items-center justify-between">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Assigned User" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user, index) => (
              <SelectItem key={`user_${index}`} value={`user_${index}`}>
                {user}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Label htmlFor="task-state">State</Label>
          <Switch id="task-state" />
        </div>
      </div>
    </>
  );
}
