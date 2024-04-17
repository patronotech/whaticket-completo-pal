import React from "react";

import { grey } from "@material-ui/core/colors";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";

const ConnectionIcon = ({ connectionType }) => {

    return (
        <React.Fragment>
            {connectionType === 'whatsapp' && <WhatsAppIcon fontSize="small" style={{ marginBottom: '-5px', color: "#25D366" }} />}
            {connectionType === 'instagram' && <InstagramIcon fontSize="small" style={{ marginBottom: '-5px', color: "#e1306c" }} />}
            {connectionType === 'facebook' && <FacebookIcon fontSize="small" style={{ marginBottom: '-5px', color: "#3b5998" }} />}
        </React.Fragment>
    );
};

export default ConnectionIcon;
