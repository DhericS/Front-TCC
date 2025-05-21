import React, { useEffect, useState } from 'react';
import { getToken } from '../utils/localStorageUtil';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

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
                const res = await axios.get('/usuarios/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }});
                setUser({ ...res.data, role: decoded.role });
            } catch (error) {
                toast.error('Falha ao carregar o usuário');
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);	

    return { user, loading };
}