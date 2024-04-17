import { Chip, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useState } from "react";
import toastError from "../../errors/toastError";
import api from "../../services/api";

export function ConnectionsFilter({ onFiltered }) {
    const [connections, setConnections] = useState([]);
    const [selecteds, setSelecteds] = useState([]);

    useEffect(() => {
        async function fetchData() {
            await loadConnections();
        }
        fetchData();
    }, []);

    const loadConnections = async () => {
        try {
            const { data } = await api.get(`/whatsapp`);
            setConnections(data);
        } catch (err) {
            toastError(err);
        }
    };

    const onChange = async (value) => {
        setSelecteds(value);
        onFiltered(value);
    };

    return (
        <Autocomplete
            multiple
            size="small"
            options={connections}
            value={selecteds}
            onChange={(e, v, r) => onChange(v)}
            getOptionLabel={(option) => option.name}
            renderTags={(value, getContactProps) =>
                value.map((option, index) => (
                    <Chip
                        variant="outlined"
                        style={{
                            backgroundColor: option.color || "#666",
                            textShadow: "1px 1px 1px #000",
                            color: "white",
                        }}
                        label={option.name}
                        {...getContactProps({ index })}
                        size="small"
                    />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Conexões"
                />
            )}
        />
    );
}
