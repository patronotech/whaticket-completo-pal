import React from "react";

import Paper from "@material-ui/core/Paper";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Skeleton from "@material-ui/lab/Skeleton";

import { makeStyles } from "@material-ui/core/styles";
import { green, grey } from '@material-ui/core/colors';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import moment from 'moment';

import Rating from '@material-ui/lab/Rating';
import { i18n } from "../../translate/i18n";

const useStyles = makeStyles(theme => ({
    on: {
        color: green[600],
        fontSize: '20px'
    },
    off: {
        color: grey[600],
        fontSize: '20px'
    },
    pointer: {
        cursor: "pointer"
    }
}));

export function RatingBox({ rating }) {
    const ratingTrunc = rating === null ? 0 : Math.trunc(rating);
    return <Rating
        defaultValue={ratingTrunc}
        max={3}
        readOnly
    />
}

export default function TableAttendantsStatus(props) {
    const { loading, attendants } = props
    const classes = useStyles();

    function renderList() {
        return attendants.map((a, k) => (
            <TableRow key={k}>
                <TableCell>{a.name}</TableCell>
                {/* <TableCell align="center" title="1 - Insatisfeito, 2 - Satisfeito, 3 - Muito Satisfeito" className={classes.pointer}>
                    <RatingBox rating={a.rating} />
                </TableCell> */}
                <TableCell align="center">{a.rating}</TableCell>
                <TableCell align="center">{a.countRating}</TableCell>
                <TableCell align="center">{a.tickets}</TableCell>
                <TableCell align="center">{formatTime(a.avgWaitTime, 2)}</TableCell>
                <TableCell align="center">{formatTime(a.avgSupportTime, 2)}</TableCell>
                <TableCell align="center">
                    {a.online ?
                        <Tooltip title="Online">
                            <CheckCircleIcon className={classes.on} />
                        </Tooltip>
                        :
                        <Tooltip title="Offline">
                            <ErrorIcon className={classes.off} />
                        </Tooltip>
                    }
                </TableCell>
            </TableRow>
        ))
    }

    function formatTime(minutes) {
        return moment().startOf('day').add(minutes, 'minutes').format('HH[h] mm[m]');
    }

    return (!loading ?
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{i18n.t("dashboard.users.name")}</TableCell>
                        <TableCell align="center">{i18n.t("dashboard.assessments.score")}</TableCell>
                        <TableCell align="center">{i18n.t("dashboard.assessments.ratedCalls")}</TableCell>
                        <TableCell align="center">{i18n.t("dashboard.assessments.totalCalls")}</TableCell>
                        <TableCell align="center">{i18n.t("dashboard.cards.averageWaitingTime")}</TableCell>
                        <TableCell align="center">{i18n.t("dashboard.cards.averageServiceTime")}</TableCell>
                        <TableCell align="center">{i18n.t("dashboard.cards.status")}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {renderList()}
                </TableBody>
            </Table>
        </TableContainer>
        : <Skeleton variant="rect" height={150} />
    )
}