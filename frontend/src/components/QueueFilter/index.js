import { Chip, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useState } from "react";
import toastError from "../../errors/toastError";
import api from "../../services/api";

export function QueueFilter({ onFiltered }) {
    const [queues, setQueues] = useState([]);
    const [selecteds, setSelecteds] = useState([]);

    useEffect(() => {
        async function fetchData() {
            await loadQueues();
        }
        fetchData();
    }, []);

    const loadQueues = async () => {
        try {
            const { data } = await api.get(`/queue`);
            setQueues(data);
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
            options={queues}
            value={selecteds}
            onChange={(e, v, r) => onChange(v)}
            getOptionLabel={(option) => option.name}
            renderQueues={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip
                        variant="outlined"
                        style={{
                            backgroundColor: option.color || "#eee",
                            textShadow: "1px 1px 1px #000",
                            color: "white",
                        }}
                        label={option.name}
                        {...getTagProps({ index })}
                        size="small"
                    />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Departamentos"
                />
            )}
        />
    );
}
