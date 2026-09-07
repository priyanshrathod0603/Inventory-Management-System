'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  description,
  breadcrumbs,
  actions,
  children,
}: PageHeaderProps) {
  const subText = subtitle || description;
  const actionContent = actions || children;

  return (
    <div className="mb-6 pb-4 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-[11px] text-content-muted mb-1.5" aria-label="Breadcrumb">
            <Link href="/dashboard" className="hover:text-navy-950 transition font-medium">
              Home
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.label + idx}>
                <ChevronRight className="w-3 h-3 text-border-dark shrink-0" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-navy-950 transition font-medium">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-navy-950 font-bold">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-navy-950 font-sans">{title}</h1>
        {subText && <p className="text-xs sm:text-sm text-content-secondary mt-1 font-normal leading-relaxed">{subText}</p>}
      </div>

      {actionContent && <div className="flex items-center gap-2.5 shrink-0 flex-wrap">{actionContent}</div>}
    </div>
  );
}
