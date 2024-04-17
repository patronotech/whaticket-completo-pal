import React from "react";

import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Checkbox, ListItemText } from "@material-ui/core";
import { i18n } from "../../translate/i18n";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  menuListItem: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  menuItem: {
    maxHeight: 30,
  },
}));

const TicketsQueueSelect = ({
  userQueues,
  selectedQueueIds = [],
  onChange,
}) => {
  const classes = useStyles();

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div style={{ width: 120, marginTop: -4 }}>
      <FormControl fullWidth margin="dense">
        <Select
          multiple
          displayEmpty
          variant="outlined"
          value={selectedQueueIds}
          onChange={handleChange}
          style={{
            borderRadius: 8,
            height: 30,
          }}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "center",
            },
            getContentAnchorEl: null,
            PaperProps: {
              style: {
                borderRadius: "0 0 8px 8px",
              },
            },
            MenuListProps: {
              className: classes.menuListItem,
            },
          }}
          renderValue={() => i18n.t("ticketsQueueSelect.placeholder")}
        >
          {userQueues?.length > 0 &&
            userQueues.map((queue) => (
              <MenuItem
                dense
                key={queue.id}
                value={queue.id}
                className={classes.menuItem}
              >
                <Checkbox
                  style={{
                    color: queue.color,
                  }}
                  size="small"
                  color="primary"
                  checked={selectedQueueIds.indexOf(queue.id) > -1}
                />
                <ListItemText
                  primary={queue.name}
                  classes={{ primary: classes.listItemText }}
                />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default TicketsQueueSelect;