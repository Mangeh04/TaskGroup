import {
	SidebarProvider,
	SidebarTrigger,
	SidebarInset,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/custom/sideBar";
import { EmptyPage } from "@/components/custom/empty";
import emptyImage from "@/public/images/empty-folder.webp";
import { ProjectCard } from "@/app/dashboard/components/project"
import { PlusIcon } from "lucide-react";
import { CustomDialog } from "@/components/custom/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const data: Array<{
    title: string;
    numTasks: number;
    numUsers: number;
  }> = [{
    title: "Uxio pìto chico",
    numTasks: 8,
    numUsers: 3,
  },{
    title: "Miguel tonto",
    numTasks: 5,
    numUsers: 2,
  },{
    title: "Uxio es negrazo",
    numTasks: 3,
    numUsers: 1,
  },{
    title: "Uxio es negrazo",
    numTasks: 3,
    numUsers: 1,
  },{
    title: "Uxio es negrazo",
    numTasks: 3,
    numUsers: 1,
  },{
    title: "Uxio es negrazo",
    numTasks: 3,
    numUsers: 1,
  },{
    title: "Uxio es negrazo",
    numTasks: 3,
    numUsers: 1,
  }]
  const hasProjects = data.length > 0;

  return (
		<div className="flex h-dvh overflow-hidden">
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset className="flex h-[98%] flex-1 flex-col">
					<header className="flex h-14 shrink-0 items-center gap-2 px-4">
						<SidebarTrigger />
						<h1 className="text-lg font-semibold">Projects</h1>
					</header>

					{hasProjects ? (
            <div className="flex flex-col gap-4 flex-1 px-4 py-6">
              <CustomDialog
                buttonString="Create Project"
                title="Create a new Project"
                subtitle="Create your new projects here. Click save when you're done"
                confirmIcon={<PlusIcon />}
              >
                <Label htmlFor="project-name">Project Name</Label>
                <Input id="project-name" name="Project Name" placeholder="Incredible Project" />
              </CustomDialog>
              {data.map((item, index) => (
                <ProjectCard key={index} title={item.title} numTasks={item.numTasks} numUsers={item.numUsers} />
              ))}
            </div>
					) : (
						<div className="flex flex-1 items-center justify-center p-6 overflow-hidden">
							<EmptyPage
								title="You don't have any projects yet"
								buttonString="Create Project"
								imageSrc={emptyImage}
								imageAlt="Empty projects illustration"
							/>
						</div>
					)}
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
