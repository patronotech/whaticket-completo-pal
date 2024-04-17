import { Grid, TextField } from "@material-ui/core";
import React from "react";
import { i18n } from "../../translate/i18n";

export function UpdatedAtFilter({ dateStart, dateEnd }) {
    const onChangeStart = async (value) => {
        dateStart(value);
    };

    const onChangeEnd = async (value) => {
        dateEnd(value);
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
                <TextField
                    fullWidth
                    name="updatedStart"
                    label={i18n.t("tickets.filters.updatedAt")}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    type="date"
                    variant="outlined"
                    size="small"
                    defaultValue=""
                    onChange={(e) => onChangeStart(e.target.value)}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
                <TextField
                    fullWidth
                    name="updatedEnd"
                    label={i18n.t("tickets.filters.to")}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    type="date"
                    variant="outlined"
                    size="small"
                    defaultValue=""
                    onChange={(e) => onChangeEnd(e.target.value)}
                />
            </Grid>
        </Grid>
    );
}
