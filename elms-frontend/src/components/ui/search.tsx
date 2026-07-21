"use client";

import {Search} from 'lucide-react';
import {Input} from "@/components/ui/input"


const SearchInput = () => {
    return (
        <div className="sm:max-w-xs flex items-center border border-gray-300 rounded-lg px-2">
            <Search className="w-4 h-4 mr-2" />
            <Input className="border-none focus:outline-0" type="text" placeholder="Search..." />
        </div>
    )
}

export default SearchInput;
