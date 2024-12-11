import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import * as React from "react";

export default function Copyright(props) {
    return (
        <Typography
            variant="body2"
            align="center"
            {...props}
            sx={[
                {
                    color: "text.secondary",
                },
                ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
            ]}
        >
            {"Copyright © "}
            <Link color="inherit" href="/admin">
                KKP Phone Store
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}
