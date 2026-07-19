export type RowConfig<T> = {
    title: string;
    description: string;
    render: (row: T) => React.ReactNode;
}


export type CardTableProps<T> = {
    column: RowConfig<T>[];
    rows: T[] | undefined;
    isLoading: boolean;
    emptyMessage: string;
}


