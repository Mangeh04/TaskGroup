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

import AppSidebar from "@/components/custom/sideBar";
import { EmptyPage } from "@/components/custom/empty";
import {
  ProjectCard,
  type ProjectCardProps,
  SkeletonCard, // ⬅️ importamos SkeletonCard desde el archivo de componentes
} from "@/app/dashboard/components/project";
import { CustomDialog } from "@/components/custom/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import emptyImage from "@/public/images/empty-folder.webp";
import { PlusIcon } from "lucide-react";

export default function DashboardPage() {
  const data: Array<ProjectCardProps> = [
    {
      title: "Proyecto Fénix",
      description: "Refactorización completa del backend monolítico.",
      numTasks: 45,
      numUsers: 8,
    },
    {
      title: "E-commerce Relaunch",
      description: "Rediseño y migración de la tienda online (Shopify a Next.js).",
      numTasks: 28,
      numUsers: 5,
    },
    {
      title: "Portal de Onboarding (RRHH)",
      description: "Crear una herramienta interna para los nuevos empleados.",
      numTasks: 12,
      numUsers: 3,
    },
    {
      title: "App Móvil v2.0",
      description: "Desarrollo de la nueva app nativa (iOS y Android).",
      numTasks: 35,
      numUsers: 6,
    },
    {
      title: "Optimización SEO (Marketing)",
      description: "Mejorar Core Web Vitals y estrategia de keywords.",
      numTasks: 9,
      numUsers: 2,
    },
    {
      title: "Integración API (Cliente Acme)",
      description: "Conectar nuestro sistema con el ERP del cliente Acme.",
      numTasks: 14,
      numUsers: 4,
    },
    {
      title: "Dashboard de Analíticas",
      description: "Implementación de Metabase para Business Intelligence.",
      numTasks: 11,
      numUsers: 3,
    },
    {
      title: "Iniciativa Titán",
      description: "Expansión de la plataforma a mercados de LATAM.",
      numTasks: 5,
      numUsers: 4,
    },
    {
      title: "Sprint Deuda Técnica (Q4)",
      description: "Resolución de bugs críticos y mejora de performance.",
      numTasks: 52,
      numUsers: 10,
    },
    {
      title: "Sistema de Notificaciones",
      description: "Crear el microservicio de alertas y emails.",
      numTasks: 17,
      numUsers: 3,
    },
  ];
  const hasProjects = data.length > 0;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(true); // ⬅️ estado de carga

  // Contenedor con scroll y lista con gap (flex-col)
  const listContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // pequeño helper para simular/forzar carga mínima (mejor UX al paginar)
  const flashLoading = (minMs = 300) => {
    setIsLoading(true);
    const id = setTimeout(() => setIsLoading(false), minMs);
    return () => clearTimeout(id);
  };

  // Medir alto real de card + gap vertical (rowGap) => items por página
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (!listContainerRef.current || !listRef.current) return;

      const availableHeight = listContainerRef.current.clientHeight;

      const style = getComputedStyle(listRef.current);
      // rowGap para eje vertical en flex/grid; fallback a gap o 16
      const gap = parseInt(style.rowGap || style.gap || "16", 10) || 16;

      // Tomamos una card de muestra
      const sampleCard =
        listRef.current.querySelector<HTMLElement>("[data-project-card]");
      const cardHeight = sampleCard?.offsetHeight ?? 120; // fallback seguro

      // Cuántas filas (cards) caben verticalmente
      const rows = Math.max(
        1,
        Math.floor((availableHeight + gap) / (cardHeight + gap))
      );

      setItemsPerPage(rows);
    };

    // Ejecutar al montar y en resize
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    // Observar cambios de tamaño del contenedor y una card (por cambios de contenido)
    const ro = new ResizeObserver(updateItemsPerPage);
    if (listContainerRef.current) ro.observe(listContainerRef.current);

    let sampleNode: Element | null = null;
    if (listRef.current) {
      sampleNode = listRef.current.querySelector("[data-project-card]");
      if (sampleNode) ro.observe(sampleNode as HTMLElement);
    }

    // Mostrar esqueleto un instante al cargar
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

  // número exacto de skeletons visibles en la página actual
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
                </CustomDialog>
              </div>

              {/* Contenedor con scroll */}
              <div ref={listContainerRef} className="flex-1 overflow-y-auto">
                {/* Lista vertical con gap medible */}
                <div ref={listRef} className="flex flex-col gap-4">
                  {isLoading
                    ? Array.from({ length: visibleCount }).map((_, i) => (
                      // wrapper con data-project-card y altura consistente
                      <div
                        key={`project_skeleton_${i}`}
                        data-project-card
                        className="min-h-[88px]"
                      >
                        <SkeletonCard />
                      </div>
                    ))
                    : currentData.map((item, index) => (
                      // wrapper para medir una card
                      <div
                        key={startIndex + index}
                        data-project-card
                        className="min-h-[88px]"
                      >
                        <ProjectCard
                          title={item.title}
                          description={item.description}
                          numTasks={item.numTasks}
                          numUsers={item.numUsers}
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
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => handlePageClick(e, page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={handleNext}
                        aria-disabled={currentPage === totalPages}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
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
                customDialog={{
                  title: "You don't have any projects yet",
                  subtitle:
                    "Create your new projects here. Click save when you're done",
                }}
              >
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
              </EmptyPage>
            </div>
          )}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
