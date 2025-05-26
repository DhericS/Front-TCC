import React, { useEffect, useState } from 'react';
import { getToken } from '../utils/localStorageUtil';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const useGetUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();

        // Se não houver token, apenas termina a execução sem fazer requisição
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

        // Função para buscar dados do usuário
        const fetchUser = async () => {
            setLoading(true);
            try {
                const res = await api.get('/usuarios/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                // Salva os dados do usuário e a role decodificada
                setUser({ ...res.data, role: decoded.role });
            } catch (error) {
                toast.error('Falha ao carregar o usuário');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []); // Dependência vazia significa que esse efeito roda uma vez no início

    return { user, loading };
};
