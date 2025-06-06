import React, { useEffect, useState } from 'react';
import { getToken } from '../utils/localStorageUtil';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import api from '../services/api';

export const useGetUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();

        if (!token) {
            setLoading(false);
            return;
        }

        let decoded;
        try {
            decoded = jwtDecode(token);
        } catch (err) {
            localStorage.removeItem('token');
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            setLoading(true);
            try {
                const res = await api.get('/usuarios/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }});
                setUser({ ...res.data, role: decoded.role });
            } catch (error) {
                toast.error('Sessão expirada! Faça login novamente!');
                localStorage.removeItem('token')
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);	

    return { user, loading };
}