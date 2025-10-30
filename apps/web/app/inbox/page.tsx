"use client";

import { useState, useEffect, useRef, type MouseEvent } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

import AppSidebar from "@/components/custom/sideBar";

import { Loader2 } from "lucide-react";
import { SkeletonCard} from "@/app/projectdetails/components/task";

export default function inboxPage() {

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

  const handlePrevious = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (currentPage === 1) return;
    flashLoading(250);
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (currentPage === 5) return;
    flashLoading(250);
    setCurrentPage((prev) => Math.min(prev + 1, 5));
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
        <AppSidebar/>
        <SidebarInset className="flex flex-1 min-h-0 flex-col bg-white dark:bg-neutral-950">
          <header className="relative flex h-14 shrink-0 items-center gap-6 px-4 border-b">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Inbox</h1>


            {isLoading && (
              <div className="ml-4 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/80" />
                <span className="text-xs text-muted-foreground">Cargando…</span>
              </div>
            )}
          </header>
          </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
