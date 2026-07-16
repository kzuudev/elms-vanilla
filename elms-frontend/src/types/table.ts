export type ColumnConfig<T> = {
    header: string;
    render: (row: T) => React.ReactNode;
}


export type ActivityTableProps<T> = {
    columns: ColumnConfig<T>[];
    rows: T[] | undefined;
    isLoading: boolean;
    emptyMessage: string;
};
