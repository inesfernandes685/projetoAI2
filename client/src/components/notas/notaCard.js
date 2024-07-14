import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import EditarNota from './notaEditar'; 
import api from '../api/api';

const NotaCard = ({ nota, index, onNotaChange }) => {
    const [editarNotaDialogOpen, setEditarNotaDialogOpen] = useState(false);
    const [notaSelecionada, setNotaSelecionada] = useState(nota);
    const [corDaBorda, setCorDaBorda] = useState('#ccc');

    const atualizarCorDaBorda = (notaAtual) => {
        const prioridadeCores = {
            Casual: '#008631',
            Importante: '#ffd700',
            Urgente: '#ff6347',
        };
        const novaCor = prioridadeCores[notaAtual.prioridade] || '#ccc'; 
        setCorDaBorda(novaCor);
    };

    useEffect(() => {
        atualizarCorDaBorda(nota);
    }, [nota]);

    const handleDelete = (id) => {
        api.delete(`/notas/${id}`)
            .then(() => {
                onNotaChange(null);
            })
            .catch((error) => {
                console.error('Erro ao apagar nota:', error);
            });
    };


    const handleAbrirEditarNota = () => {
        if (onNotaChange) {
            onNotaChange(nota); 
        }
        setNotaSelecionada(nota);
        setEditarNotaDialogOpen(true);
    };

    const handleFecharEditarNota = () => {
        if (onNotaChange) {
            onNotaChange(nota); 
        }
        setEditarNotaDialogOpen(false);
        setNotaSelecionada(null);
    };

    const handleGuardarAlteracoes = (notaEditada) => {
        api.put(`/notas/${notaEditada.id}`, notaEditada)
            .then(() => {
                setNotaSelecionada(notaEditada);
                onNotaChange(notaEditada);
                atualizarCorDaBorda(notaEditada);
                setEditarNotaDialogOpen(false); 
                // Aqui atualizamos também o estado principal do `NotaCard`
                nota.prioridade = notaEditada.prioridade;
                nota.titulo = notaEditada.titulo;
                nota.descricao = notaEditada.descricao;
                nota.estado = notaEditada.estado; // Atualiza o estado da nota
            })
            .catch((error) => {
                console.error('Erro ao atualizar nota:', error);
            });
    };

    return (
        <>
            <Draggable draggableId={nota.id.toString()} index={index}>
                {(provided, snapshot) => (
                    <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                            marginY: 1,
                            padding: 1.5,
                            border: `1px solid ${corDaBorda}`,
                            borderRadius: 2,
                            backgroundColor: '#ffffff',
                            ...provided.draggableProps.style,
                        }}
                        onClick={handleAbrirEditarNota}
                    >
                        <Typography
                            variant="h6"
                            sx={{ 
                                marginBottom: 0.5,
                                textDecoration: nota.estado ? 'line-through' : 'none' 
                            }}
                        >
                            {nota.titulo}
                        </Typography>
                        <Typography
                            sx={{
                                marginBottom: 0.5,
                                textDecoration: nota.estado ? 'line-through' : 'none' 
                            }}
                        >
                            {nota.descricao}
                        </Typography>
                        {nota.data && (
                            <Typography variant="body2" color="textSecondary">
                                Data: {nota.data}
                            </Typography>
                        )}
                    </Box>
                )}
            </Draggable>

            <EditarNota
                open={editarNotaDialogOpen}
                onClose={handleFecharEditarNota}
                nota={notaSelecionada}
                onSave={handleGuardarAlteracoes}
                onNotaChange={onNotaChange}
                onDelete={handleDelete}
            />
        </>
    );
};

export default NotaCard;
