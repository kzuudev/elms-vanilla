"use client";

import { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import {api} from "@/lib/api.ts";

import { AuthContext } from '@/features/context/auth/AuthContext';
import AdminRegisterForm from '@/features/register/AdminRegisterForm';
import SuperAdminRegisterForm from '@/features/register/SuperAdminRegisterForm';


interface RegisterFormProps {
    closeDialog: () => void;
}

interface RegisterFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    salary: string;
    assigned_to: string | null;
}

export default function Register({closeDialog}: RegisterFormProps) {


    const { user } = useContext(AuthContext);

    const role = user?.role;

    const isAdmin = role === 'admin';
    const isSuperAdmin = role === 'super-admin';

    const [managers, setManagers] = useState<{value: string, label: string}[]>([]);
    const [admins, setAdmins] = useState<{value: string, label: string}[]>([]);

    const [error, setError] = useState<string | null>(null);


    // Fetch managers — EmployeesController@managers
    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const holder = localStorage.getItem("token");
                const response = await api.get("/employees/managers", {
                    headers: { Authorization: `Bearer ${holder}` },
                });

                setManagers(
                    (response.data.data.managers ?? []).map(
                        (manager: { id: number; first_name: string; last_name: string }) => ({
                            value: String(manager.id),
                            label: `${manager.first_name} ${manager.last_name}`,
                        })
                    )
                );
                setError(null);
            } catch (e) {
                if (axios.isCancel(e)) return;
                setManagers([]);
                if (axios.isAxiosError(e)) {
                    setError(
                        e.response?.data?.error ||
                        e.response?.data?.message ||
                        "Failed to load managers from the server"
                    );
                } else {
                    setError("Failed to load managers from the server");
                    setManagers([]);
                }
            }
        };

        fetchManagers();
    }, []);

    // Fetch admins — EmployeesController@admins
    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const holder = localStorage.getItem("token");
                const response = await api.get("/employees/admins", {
                    headers: { Authorization: `Bearer ${holder}` },
                });

                setAdmins(
                    (response.data.data.admins ?? []).map(
                        (admin: { id: number; first_name: string; last_name: string }) => ({
                            value: String(admin.id),
                            label: `${admin.first_name} ${admin.last_name}`,
                        })
                    )
                );
                setError(null);
            } catch (e) {
                if (axios.isCancel(e)) return;
                setAdmins([]);
                if (axios.isAxiosError(e)) {
                    setError(e.response?.data?.error || e.response?.data?.message || "Failed to load admins from the server");
                } else {
                    setError("Failed to load admins from the server");
                    setAdmins([]);
                }
            }
        };

        fetchAdmins();
    }, []);

    const onSubmit = async (data: RegisterFormData) => {

        const token = localStorage.getItem("token");

        try {
            const response = await api.post("/register", data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.data.success) {
                window.dispatchEvent(new Event('user-mutated'));
                closeDialog();
            }
        } catch (e) {
            if (axios.isAxiosError(e)) {
                setError(e.response?.data?.error || e.response?.data?.message || "Failed to register user");
            } else {
                setError("Failed to register user");
            }
        }
    }

    return (
        <>
            <div className="px-4">
                <div className="mb-4">
                    <h1 className="text-lg font-bold">Register</h1>
                    <h2 className="text-sm text-gray-500">Fill up the form to register a new user</h2>
                </div>

                {isAdmin && (
                    <AdminRegisterForm managers={managers} onSubmit={onSubmit} onCancel={closeDialog} />
                )}
                    
                {isSuperAdmin && (
                    <SuperAdminRegisterForm managers={managers} admins={admins}  onSubmit={onSubmit} onCancel={closeDialog} />
                )}
            </div>

            {error && (
                <div className="flex justify-center items-center">
                    <p className="text-red-500">{error}</p>
                </div>
            )}
        </>
    )
}
