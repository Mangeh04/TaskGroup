// --> AÑADIDO: Indica que es un Componente de Cliente
"use client";

// --> AÑADIDO: Importar useState para manejar el estado de la página
import { useState } from "react";
import type { MouseEvent } from "react"; // Para tipar los eventos de clic
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Pagination,
  PaginationContent,
  // PaginationEllipsis, // No la usaremos en este ejemplo simple
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import AppSidebar from "@/components/custom/sideBar";
import { EmptyPage } from "@/components/custom/empty";
import emptyImage from "@/public/images/empty-folder.webp";
import { ProjectCard } from "@/app/dashboard/components/project"
import { PlusIcon } from "lucide-react";
import { CustomDialog } from "@/components/custom/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


const ITEMS_PER_PAGE = 7;

export default function DashboardPage() {
  // He reemplazado los títulos ofensivos por ejemplos genéricos
  const data: Array<{
    title: string;
    numTasks: number;
    numUsers: number;
  }> = [
    { title: "Proyecto Alpha", numTasks: 8, numUsers: 3 },
    { title: "Proyecto Bravo", numTasks: 5, numUsers: 2 },
    { title: "Proyecto Charlie", numTasks: 3, numUsers: 1 },
    { title: "Proyecto Delta", numTasks: 3, numUsers: 1 },
    { title: "Proyecto Echo", numTasks: 3, numUsers: 1 },
    { title: "Proyecto Foxtrot", numTasks: 3, numUsers: 1 },
    { title: "Proyecto Golf", numTasks: 3, numUsers: 1 },
    { title: "Proyecto Hotel", numTasks: 3, numUsers: 1 },
    { title: "Proyecto Golf", numTasks: 3, numUsers: 1 },
    { title: "Proyecto Hotel", numTasks: 3, numUsers: 1 },
    { title: "Proyecto Golf", numTasks: 3, numUsers: 1 },
    { title: "Proyecto Hotel", numTasks: 3, numUsers: 1 },
    { title: "Proyecto Golf", numTasks: 3, numUsers: 1 },
    { title: "Proyecto Hotel", numTasks: 3, numUsers: 1 },
    { title: "Proyecto Golf", numTasks: 3, numUsers: 1 },
    { title: "Proyecto Hotel", numTasks: 3, numUsers: 1 },
  ];
  const hasProjects = data.length > 0;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevious = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrentPage((prev) => Math.max(prev - 1, 1)); // No ir por debajo de 1
  };

  const handleNext = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (e: MouseEvent<HTMLAnchorElement>, page: number) => {
    e.preventDefault();
    setCurrentPage(page);
  };


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

              {currentData.map((item, index) => (
                <ProjectCard
                  key={startIndex + index}
                  title={item.title}
                  numTasks={item.numTasks}
                  numUsers={item.numUsers} />
              ))}

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={handlePrevious}
                      aria-disabled={currentPage === 1}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => handlePageClick(e, page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={handleNext}
                      aria-disabled={currentPage === totalPages}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
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