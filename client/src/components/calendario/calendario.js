import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import 'moment/locale/pt';

const localizer = momentLocalizer(moment);

const Calendario = () => {
  const [notas, setNotas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotas = async () => {
      try {
        const response = await api.get('/notas/utilizador');
        setNotas(response.data);
      } catch (error) {
        console.error('Erro ao procurar notas:', error.response || error.message);
      }
    };

    fetchNotas();
  }, []); 

  const handleSelectNota = (nota) => {
    console.log('Nota selecionada:', nota);
    navigate(`/projetos/${nota.idProjeto}`); 
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = '#ccc'; 

    if (event.prioridade === 'Casual') {
      backgroundColor = '#008631'; // Verde para prioridade Casual
    } else if (event.prioridade === 'Importante') {
      backgroundColor = '#ffd700'; // Amarelo para prioridade Importante
    } else if (event.prioridade === 'Urgente') {
      backgroundColor = '#ff6347'; // Vermelho para prioridade Urgente
    }

    return {
      style: {
        backgroundColor,
      }
    };
  };

  return (
    <div style={{ height: '75vh', width: '97vw'}}>
      <Calendar
        localizer={localizer}
        events={notas.map(nota => ({
          id: nota.id,
          title: `${nota.titulo}`,
          start: nota.data ? new Date(nota.data) : new Date(), 
          end: nota.data ? new Date(nota.data) : new Date(),
          description: nota.descricao,
          prioridade: nota.prioridade,
          idProjeto: nota.idProjeto,
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectEvent={handleSelectNota}
        eventPropGetter={eventStyleGetter} 
        messages={{
          next: "Seguinte",
          previous: "Anterior",
          today: "Hoje",
          month: "Mês",
          week: "Semana",
          day: "Dia",
        }}
      />
    </div>
  );
};

export default Calendario;
