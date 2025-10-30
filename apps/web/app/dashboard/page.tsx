// --> AÑADIDO: Indica que es un Componente de Cliente
"use client";

import { useState, useEffect, useRef, type MouseEvent } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import AppSidebar from "@/components/custom/sideBar";
import { EmptyPage } from "@/components/custom/empty";
import { ProjectCard } from "@/app/dashboard/components/project"
import { CustomDialog } from "@/components/custom/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import emptyImage from "@/public/images/empty-folder.webp";
import { PlusIcon } from "lucide-react";

const PROJECT_CARD_WITH_GAP_HEIGHT = 96;

export default function DashboardPage() {
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
    { title: "Proyecto India", numTasks: 3, numUsers: 1 },
    { title: "Proyecto Juliet", numTasks: 3, numUsers: 1 },
  ];
  const hasProjects = data.length > 0;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const listContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (listContainerRef.current) {
        const availableHeight = listContainerRef.current.clientHeight;
        const count = Math.max(
          1,
          Math.floor(availableHeight / PROJECT_CARD_WITH_GAP_HEIGHT)
        );
        setItemsPerPage(count);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);


  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    if (currentPage < 1 && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);


  const handlePrevious = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrentPage((prev) => Math.max(prev - 1, 1));
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
        <SidebarInset className="flex flex-1 min-h-0 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Projects</h1>
          </header>

          {hasProjects ? (
            <div className="flex flex-col gap-4 flex-1 min-h-0 px-4 py-6 overflow-hidden">
              <div className="shrink-0">
                <CustomDialog
                  buttonString="Create Project"
                  title="Create a new Project"
                  subtitle="Create your new projects here. Click save when you're done"
                  confirmIcon={<PlusIcon />}
                >
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input id="project-name" name="Project Name" placeholder="Incredible Project" />
                </CustomDialog>
              </div>

              <div ref={listContainerRef} className="flex-1 overflow-y-auto">
                <div className="flex flex-col gap-4">
                  {currentData.map((item, index) => (
                    <ProjectCard
                      key={startIndex + index}
                      title={item.title}
                      numTasks={item.numTasks}
                      numUsers={item.numUsers} />
                  ))}
                </div>
              </div>

              <div className="shrink-0">
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
                    {totalPages > 0 && Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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