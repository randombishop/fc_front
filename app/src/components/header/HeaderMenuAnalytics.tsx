import { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';


const HeaderMenuCarto = (props:any) => {
    const trendsUrl = '#/analytics/trends/-';
    const usersUrl = '#/analytics/users/-';
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button color={props.color} onClick={handleClick}>Analytics</Button>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem component="a" href={trendsUrl} onClick={handleClose}>Conversational Trends</MenuItem>
                <MenuItem component="a" href={usersUrl} onClick={handleClose}>User Analysis</MenuItem>
            </Menu>
        </div>
    );
};


export default HeaderMenuCarto ;
