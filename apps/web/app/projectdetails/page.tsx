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
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import AppSidebar from "@/components/custom/sideBar";
import { EmptyPage } from "@/components/custom/empty";
import { CustomDialog } from "@/components/custom/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import emptyImage from "@/public/images/empty-task.webp";
import { PlusIcon, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  type TaskCardProps,
  TaskCard,
  SkeletonCard,
} from "@/app/projectdetails/components/task";
import { Progress } from "@/components/ui/progress";

export default function ProjectPage() {
  const users: Array<string> = [
    "mangeh04",
    "blackfox099",
    "axiur",
    "alejandropxrez",
  ];

  const subDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };

  const today = new Date();

  const data: Array<TaskCardProps> = [
    {
      user: users[0]!,
      title: "Diseñar wireframes de la landing",
      description: "Crear el boceto inicial en Figma.",
      date: subDays(today, 1),
      state: "Pending",
    },
    {
      user: users[1]!,
      title: "Implementar autenticación",
      description: "Añadir login con Google y GitHub.",
      date: subDays(today, 0),
      state: "Pending",
    },
    {
      user: users[2]!,
      title: "Configurar la base de datos",
      description: "Inicializar el schema de Prisma.",
      date: subDays(today, 2),
      state: "Done",
    },
    {
      user: users[3]!,
      title: "Escribir tests de la API",
      description: "Usar Jest para los endpoints de /api/projects.",
      date: subDays(today, 1),
      state: "Pending",
    },
    {
      user: users[0]!,
      title: "Revisar Pull Request #42",
      description: "Feedback sobre la feature de 'drag and drop'.",
      date: subDays(today, 3),
      state: "Done",
    },
    {
      user: users[1]!,
      title: "Desplegar entorno de staging",
      description: "Configurar el pipeline de Vercel para 'develop'.",
      date: subDays(today, 0),
      state: "Done",
    },
    {
      user: users[2]!,
      title: "Crear componentes de UI",
      description: "Pasar botones y inputs de Figma a React.",
      date: subDays(today, 4),
      state: "Done",
    },
    {
      user: users[3]!,
      title: "Optimizar imágenes",
      description: "Usar next/image y comprimir los assets 'webp'.",
      date: subDays(today, 2),
      state: "Pending",
    },
    {
      user: users[0]!,
      title: "Redactar documentación",
      description: "Escribir la guía de inicio rápido en el README.md.",
      date: subDays(today, 5),
      state: "Pending",
    },
    {
      user: users[1]!,
      title: "Solucionar bug de layout",
      description: "El footer se superpone en vistas móviles.",
      date: subDays(today, 0),
      state: "Pending",
    },
    {
      user: users[2]!,
      title: "Refactorizar el hook useTasks",
      description: "Simplificar la lógica de estado y separar la mutación.",
      date: subDays(today, 6),
      state: "Done",
    },
    {
      user: users[3]!,
      title: "Investigar librería de gráficos",
      description: "Comparar Chart.js vs Recharts para el dashboard.",
      date: subDays(today, 1),
      state: "Done",
    },
  ];

  const hasTasks = data.length > 0;

  const totalTasks = data.length;
  const completedTasks = data.filter(task => task.state === "Done").length;
  const pendingTasks = totalTasks - completedTasks;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  const listContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const flashLoading = (minMs = 300) => {
    setIsLoading(true);
    const id = setTimeout(() => setIsLoading(false), minMs);
    return () => clearTimeout(id);
  };

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (!listContainerRef.current || !gridRef.current) return;
      const availableHeight = listContainerRef.current.clientHeight;
      const gridStyle = getComputedStyle(gridRef.current);
      const gap = parseInt(gridStyle.gap || "16", 10) || 16;

      let columns = 1;
      const gtc = gridStyle.gridTemplateColumns;
      if (gtc && gtc !== "none") {
        columns = gtc.split(" ").length;
      }

      const DEFAULT_CARD_MIN_H = 160;
      const sampleCard =
        gridRef.current.querySelector<HTMLElement>("[data-task-card]");
      const cardHeight = sampleCard?.offsetHeight ?? DEFAULT_CARD_MIN_H;

      const rows = Math.max(
        1,
        Math.floor((availableHeight + gap) / (cardHeight + gap))
      );
      const count = rows * columns;
      setItemsPerPage(count);
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    const ro = new ResizeObserver(updateItemsPerPage);
    if (listContainerRef.current) ro.observe(listContainerRef.current);
    const sampleCardNode = gridRef.current?.querySelector("[data-task-card]");
    if (sampleCardNode) ro.observe(sampleCardNode as HTMLElement);

    const clear = flashLoading(350);
    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
      ro.disconnect();
      clear?.();
    };
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const remaining = Math.max(0, data.length - startIndex);
  const visibleCount = Math.min(itemsPerPage, remaining);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1 && totalPages > 0) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const handlePrevious = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (currentPage === 1) return;
    flashLoading(250);
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (currentPage === totalPages) return;
    flashLoading(250);
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (e: MouseEvent<HTMLAnchorElement>, page: number) => {
    e.preventDefault();
    if (page === currentPage) return;
    flashLoading(250);
    setCurrentPage(page);
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-white">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-1 min-h-0 flex-col bg-white dark:bg-neutral-950">
          <header className="relative flex h-14 shrink-0 items-center gap-6 px-4 border-b">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Tasks</h1>

            <div className="ml-auto flex items-center gap-6">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{totalTasks}</span>
                <span className="text-xs font-medium text-muted-foreground">TOTAL</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{pendingTasks}</span>
                <span className="text-xs font-medium text-muted-foreground">Pending</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{completedTasks}</span>
                <span className="text-xs font-medium text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{Math.round(progressPercentage)}%</span>
                <span className="text-xs font-medium text-muted-foreground">Progress</span>
              </div>
            </div>

            {isLoading && (
              <div className="ml-4 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/80" />
                <span className="text-xs text-muted-foreground">Cargando…</span>
              </div>
            )}
          </header>
          <div className="flex items-center justify-between gap-4 px-4 py-4 border-b">
            <div className="shrink-0">
              <CustomDialog
                buttonString="Create Task"
                title="Create a new Task"
                subtitle="Create your new tasks here. Click save when you're done"
                confirmIcon={<PlusIcon />}
              >
                <Label htmlFor="task-name">Task Name</Label>
                <Input id="task-name" name="Task Name" placeholder="Incredible Task" />
                <Label htmlFor="task-description">Description</Label>
                <Input id="task-description" name="Task Description" placeholder="Description of the task" />
              </CustomDialog>
            </div>
            <div className="flex-1 max-w-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Task Progress</span>
                <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progressPercentage)}%
            </span>
              </div>
              <Progress value={progressPercentage} className="w-full" />
            </div>
          </div>

          {hasTasks ? (
            <div className="flex flex-col gap-4 flex-1 min-h-0 px-4 py-6 overflow-hidden">

              <div ref={listContainerRef} className="relative flex-1 overflow-y-auto">
                {isLoading && (
                  <div className="pointer-events-none absolute inset-0 z-10" />
                )}

                <div ref={gridRef} className="grid grid-cols-2 gap-4">
                  {isLoading
                    ? Array.from({ length: visibleCount }).map((_, i) => (
                      <div
                        key={`skeleton_${i}`}
                        data-task-card
                        className="min-h-[160px]"
                      >
                        <SkeletonCard />
                      </div>
                    ))
                    : currentData.map((item, index) => (
                      <div
                        key={startIndex + index}
                        data-task-card
                        className="min-h-[160px]"
                      >
                        <TaskCard
                          title={item.title}
                          user={item.user}
                          state={item.state}
                          date={item.date}
                          description={item.description}
                        />
                      </div>
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
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6 overflow-hidden">
              <EmptyPage
                title="You don't have any tasks yet"
                buttonString="Create Task"
                imageSrc={emptyImage}
                imageAlt="Empty tasks illustration"
                customDialog={{
                  title: "Create Task",
                  subtitle: "Create your new tasks here. Click save when you're done",
                }}
              >
                <Separator />
                <Label htmlFor="task-name">Task name</Label>
                <Input id="task-name" name="Task Name" placeholder="Incredible Task" />
                <Label htmlFor="task-description">Task description</Label>
                <Input id="task-description" name="Task Description" placeholder="Description of the Task" />
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
              </EmptyPage>
            </div>
          )}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
