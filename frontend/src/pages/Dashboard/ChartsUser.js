import React, { useEffect, useState, useContext } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import brLocale from 'date-fns/locale/pt-BR';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Button, Stack, TextField } from '@mui/material';
import Typography from "@material-ui/core/Typography";
import api from '../../services/api';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { makeStyles } from "@material-ui/core/styles";
import './button.css';
import { i18n } from '../../translate/i18n';
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.padding,
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(2),
    }
}));

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
            display: false,
        },
        title: {
            display: true,
            text: 'Tickets',
            position: 'left',
        },
        datalabels: {
            display: true,
            anchor: 'start',
            offset: -30,
            align: "start",
            color: "#fff",
            textStrokeColor: "#000",
            textStrokeWidth: 2,
            font: {
                size: 20,
                weight: "bold"

            },
        }
    },
};

export const ChatsUser = () => {
    const classes = useStyles();
    const [initialDate, setInitialDate] = useState(new Date());
    const [finalDate, setFinalDate] = useState(new Date());
    const [ticketsData, setTicketsData] = useState({ data: [] });
    const { user } = useContext(AuthContext);

    const companyId = user.companyId;

    useEffect(() => {
        handleGetTicketsInformation();
    }, []);

    const dataCharts = {

        labels: ticketsData && ticketsData?.data.length > 0 && ticketsData?.data.map((item) => item.nome),
        datasets: [
            {
                data: ticketsData?.data.length > 0 && ticketsData?.data.map((item, index) => {
                    return item.quantidade
                }),
                backgroundColor: '#065183',
            },

        ],
    };

    const handleGetTicketsInformation = async () => {
        try {

            const { data } = await api.get(`/dashboard/ticketsUsers?initialDate=${format(initialDate, 'yyyy-MM-dd')}&finalDate=${format(finalDate, 'yyyy-MM-dd')}&companyId=${companyId}`);
            setTicketsData(data);
        } catch (error) {
            toast.error('Erro ao buscar informações dos tickets');
        }
    }

    return (
        <>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                {i18n.t("dashboard.users.totalCallsUser")}
            </Typography>

            <Stack direction={'row'} spacing={2} alignItems={'center'} sx={{ my: 2, }} >

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={brLocale}>
                    <DatePicker
                        value={initialDate}
                        onChange={(newValue) => { setInitialDate(newValue) }}
                        label={i18n.t("dashboard.date.initialDate")}
                        renderInput={(params) => <TextField fullWidth {...params} sx={{ width: '20ch' }} />}

                    />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={brLocale}>
                    <DatePicker
                        value={finalDate}
                        onChange={(newValue) => { setFinalDate(newValue) }}
                        label={i18n.t("dashboard.date.finalDate")}
                        renderInput={(params) => <TextField fullWidth {...params} sx={{ width: '20ch' }} />}
                    />
                </LocalizationProvider>

                <Button className="buttonHover" onClick={handleGetTicketsInformation} variant='contained'>Filtrar</Button>

            </Stack>
            <Bar options={options} data={dataCharts} style={{ maxWidth: '100%', maxHeight: '280px', }} />
        </>
    );
}