"use client"


import { Card } from '@/components/ui/card.tsx';
import type {CardTableProps} from "@/types/card.ts";
import { MoreHorizontal } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
export default function CoverageWidget<T extends {id: number}>({column, rows, isLoading, emptyMessage}: CardTableProps<T>) {


    return (
        <>
        <Card className="w-full p-6 shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-5">
                <div className="flex flex-col">
                    {column.map((col) => (
                        <>
                            <h2 className="text-base font-semibold text-gray-900">{col.title}</h2><p
                            className="text-gray-400 text-xs">{col.description}</p>
                        </>
                ))}
            </div>

            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
            </button>
        </div>

        <ScrollArea className="h-[350px]  w-full">
            <div className="h-full pr-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full min-h-[200px] text-muted-foreground text-sm">
                        Now Loading...
                    </div>
                ) : !rows || rows.length === 0 ? (
                    <div className="flex items-center justify-center h-full min-h-[200px] text-muted-foreground text-sm">
                        {emptyMessage}
                    </div>
                ) : (
                  rows.map((row) => (
                      <div key={row.id} className="py-3 border-b border-gray-50 last:border-0">
                          {column.map((col) => (
                              <div key={col.title} className="py-3 border-b border-gray-50 last:border-0">
                                  {col.render(row)}
                              </div>
                          ))}
                      </div>
                  ))
                )}
            </div>
        </ScrollArea>
        </Card>
        </>
    )

}