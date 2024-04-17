import { Chip, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useState } from "react";
import toastError from "../../errors/toastError";
import api from "../../services/api";

export function ContactsFilter({ onFiltered }) {
    const [contacts, setContacts] = useState([]);
    const [selecteds, setSelecteds] = useState([]);

    useEffect(() => {
        async function fetchData() {
            await loadContacts();
        }
        fetchData();
    }, []);

    const loadContacts = async () => {
        try {
            const { data } = await api.get(`/contacts/list`);
            setContacts(data);
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
            options={contacts}
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
                    placeholder="Contatos"
                />
            )}
        />
    );
}
