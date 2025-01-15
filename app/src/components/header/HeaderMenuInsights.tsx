import { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';


const HeaderMenuInsights = (props:any) => {
    const trendsUrl = '#/insights/trends/-';
    const usersUrl = '#/insights/users/-';
    const networkUrl = '#/insights/network/random/10/group/1';
    const clustersUrl = '#/insights/clusters';
    const likeMeterUrl = '#/insights/like-meter/-';
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
                <MenuItem component="a" href={networkUrl} onClick={handleClose}>Networks</MenuItem>
                <MenuItem component="a" href={clustersUrl} onClick={handleClose}>Clusters</MenuItem>
                <MenuItem component="a" href={likeMeterUrl} onClick={handleClose}>Like Meter</MenuItem>
            </Menu>
        </div>
    );
};


export default HeaderMenuInsights ;
