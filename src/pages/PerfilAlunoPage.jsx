import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReviewsEditar from '../components/ReviewsEditar';

const PerfilAlunoPage = ({ user }) => {
  const navigate = useNavigate();

  const [imagemUrl, setImagemUrl] = useState(user.imagemUrl || ''); // Foto de perfil do aluno
  const [uploading, setUploading] = useState(false);

  const handleDelete = async () => {
    const confirm = window.confirm('Tem certeza que deseja excluir sua conta?');
    if (!confirm) return;

    try {
      await axios.delete(`/usuarios/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      alert('Erro ao excluir usuário.');
    }
  };

  const handleEdit = () => {
    navigate('/perfil/editar');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append("tipoUsuario", "useracad"); 

    try {
      setUploading(true);
      const res = await axios.post(`/usuarios/${user.id}/upload-imagem`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setImagemUrl(res.data.url); // Atualiza o URL da imagem
      alert('Foto de perfil atualizada!');
    } catch (error) {
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-3xl mx-auto bg-white border border-black rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Perfil do Aluno</h2>

        {/* Exibição da foto de perfil */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
            <img
              src={imagemUrl || '/assets/imagens/default-profile.jpg'} // Imagem de perfil do aluno
              alt="Foto de Perfil"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Botão de upload para a foto de perfil */}
        <div className="mb-6 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="upload-photo"
          />
          <label htmlFor="upload-photo" className="cursor-pointer text-blue-600 hover:underline">
            {uploading ? 'Enviando...' : 'Clique aqui para mudar sua foto de perfil'}
          </label>
        </div>

        {/* Detalhes do usuário */}
        <div className="space-y-4 text-black">
          <p><strong>Nome:</strong> {user.nome}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Telefone:</strong> {user.telefone}</p>
          <p><strong>Tipo de Acesso:</strong> {user.role}</p>
        </div>

        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={handleEdit}
            className="bg-black text-white px-4 py-2 rounded border border-black hover:bg-white hover:text-black transition"
          >
            Alterar Informações
          </button>
          <button
            onClick={handleDelete}
            className="bg-white text-black px-4 py-2 rounded border border-black hover:bg-black hover:text-white transition"
          >
            Excluir Conta
          </button>
        </div>
      </div>

      {/* Seções de avaliações */}
      <ReviewsEditar tipoEntidade={'ACADEMIA'} user={user} />
      <ReviewsEditar tipoEntidade={'TREINO'} user={user} />
      <ReviewsEditar tipoEntidade={'PERSONAL'} user={user} />
    </div>
  );
};

export default PerfilAlunoPage;
