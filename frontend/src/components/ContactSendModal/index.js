import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import ButtonWithSpinner from "../ButtonWithSpinner";
import ContactModal from "../ContactModal";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Grid, ListItemText, MenuItem, Select } from "@material-ui/core";
import { toast } from "react-toastify";
import { Facebook, Instagram, WhatsApp } from "@material-ui/icons";
import ShowTicketOpen from "../ShowTicketOpenModal";

const useStyles = makeStyles((theme) => ({
  online: {
    fontSize: 11,
    color: "#25d366"
  },
  offline: {
    fontSize: 11,
    color: "#e1306c"
  }
}));

const filter = createFilterOptions({
  trim: true,
});

const ContactSendModal = ({ modalOpen, onClose }) => {
  const classes = useStyles();
  const [options, setOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [newContact, setNewContact] = useState({});
  
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const { companyId, whatsappId } = user;

  useEffect(() => {
    if (!modalOpen || searchParam.length < 3) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchContacts = async () => {
        try {
          const { data } = await api.get("contacts", {
            params: { searchParam, channel: "whatsapp", isGroup: "false" },
          });

          setOptions(data.contacts);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          toastError(err);
        }
      };
      fetchContacts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, modalOpen]);

  const handleClose = () => {
    onClose();
    setSearchParam("");
    setSelectedContact(null);
  };

  const handleSendVcard = async contact => {
    if (!contact) return;
    
    setLoading(true);
    try {
      onClose(contact);
    } catch (err) {
    }
    setLoading(false);
  };


  const handleSelectOption = (e, newValue) => {
    if (newValue?.number) {
      setSelectedContact(newValue);
    } else if (newValue?.name) {
      setNewContact({ name: newValue.name });
      setContactModalOpen(true);
    }
  };

  const handleCloseContactModal = () => {
    setContactModalOpen(false);    
  };

  const handleAddNewContactTicket = contact => {
    handleSendVcard(contact);
  };

  const createAddContactOption = (filterOptions, params) => {
    const filtered = filter(filterOptions, params);
    if (params.inputValue !== "" && !loading && searchParam.length >= 3) {
      filtered.push({
        name: `${params.inputValue}`,
      });
    }
    return filtered;
  };

  const renderOption = option => {
    if (option.number) {
      return <>
        <Typography component="span" style={{ fontSize: 14, marginLeft: "10px", display: "inline-flex", alignItems: "center", lineHeight: "2" }}>
          {option.name} - {option.number}
        </Typography>
      </>
    } else {
      return `${i18n.t("SendContactModal.add")} ${option.name}`;
    }
  };

  const renderOptionLabel = option => {
    if (option.number) {
      return `${option.name} - ${option.number}`;
    } else {
      return `${option.name}`;
    }
  };

  const renderContactAutocomplete = () => {
      return (
        <Grid xs={12} item>
          <Autocomplete
            fullWidth
            options={options}
            loading={loading}
            clearOnBlur
            autoHighlight
            freeSolo
            clearOnEscape
            getOptionLabel={renderOptionLabel}
            renderOption={renderOption}
            filterOptions={createAddContactOption}
            onChange={(e, newValue) => handleSelectOption(e, newValue)}
            renderInput={params => (
              <TextField
                {...params}
                label={i18n.t("SendContactModal.fieldLabel")}
                variant="outlined"
                autoFocus
                onChange={e => setSearchParam(e.target.value)}
                onKeyPress={e => {
                  if (loading || !selectedContact) return;
                  else if (e.key === "Enter") {
                    handleSendVcard(selectedContact);
                  }
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </Grid>
      )
    return null;
  }

  return (
    <>
      <ContactModal
        open={contactModalOpen}
        initialValues={newContact}
        onClose={handleCloseContactModal}
        onSave={handleAddNewContactTicket}
      ></ContactModal>
      <Dialog open={modalOpen} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">
          {i18n.t("SendContactModal.title")}
        </DialogTitle>
        <DialogContent dividers>
          <Grid style={{ width: 300 }} container spacing={2}>
            {/* CONTATO */}
            {renderContactAutocomplete()}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="secondary"
            disabled={loading}
            variant="outlined"
          >
            {i18n.t("SendContactModal.buttons.cancel")}
          </Button>
          <ButtonWithSpinner
            variant="contained"
            type="button"
            disabled={!selectedContact}
            onClick={() => handleSendVcard(selectedContact)}
            color="primary"
            loading={loading}
          >
            {i18n.t("SendContactModal.buttons.ok")}
          </ButtonWithSpinner>
        </DialogActions>
      </Dialog >
    </>
  );
};
export default ContactSendModal;