


type FilterParams = Record<string, string | number | boolean | null | undefined>;

/**
 * Builds a clean URL query string from search and filter objects.
 * Example output: "?search=kevin&status=1&role=admin"
 */
export const buildQueryString = (params: FilterParams) : string => {

    const searchParams = new URLSearchParams();

    // convert the object into 2-Dimensional Array
    Object.entries(params).forEach(([key, value]) => {
        // Skip empty, null, or undefined values so the URL stays clean
        if(value !== null && value !== undefined && value !== "") {
            searchParams.append(key, value.toString());
            console.log(key, value);
        }
    })

    const queryString = searchParams.toString();

    return queryString ? `?${queryString}` : "";

}