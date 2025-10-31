// --> AÑADIDO: Importar los componentes necesarios
import * as React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadcrumbLinkItem = {
  label: string;
  href: string;
};

type BreadCrumbCustomProps = {
  items: BreadcrumbLinkItem[];
  currentPage: string;
};

export function BreadCrumbCustom({ items, currentPage }: BreadCrumbCustomProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>

        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={item.href}>{item.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </React.Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}