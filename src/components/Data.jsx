    import React from 'react'
    import DashboardIcon from '@mui/icons-material/Dashboard';
    import PeopleIcon from '@mui/icons-material/People';
    import LocationOnIcon from '@mui/icons-material/LocationOn';
    import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
    import EventAvailableIcon from '@mui/icons-material/EventAvailable';
    import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
    import AssessmentIcon from '@mui/icons-material/Assessment';
    import HistoryIcon from '@mui/icons-material/History';
    import TelegramIcon from '@mui/icons-material/Telegram';
    import EngineeringIcon from '@mui/icons-material/Engineering';
    import HowToRegIcon from '@mui/icons-material/HowToReg';
    import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
    import AnnouncementIcon from '@mui/icons-material/Announcement';
    import FeedIcon from '@mui/icons-material/Feed';

    export const Data = [
        {
            title: "Dashboard",
            icon: <DashboardIcon />,
            link: "/dashboard"
        },
        {
            title: "Residents",
            icon: <PeopleIcon />,
            link: "/residents",
            items: [{
                title: "Registered",
                icon: <HowToRegIcon />,
                link: "/residents/registered"
            },
            {
                title: "Voters",
                icon: <ThumbUpOffAltIcon />,
                link: "/registered/voters"
            },
        ]
            
        },
        {
            title: "Map",
            icon: <LocationOnIcon />,
            link: "/map"
        },
        {
            title: "Calendar",
            icon: <CalendarMonthIcon />,
            link: "/calendar"
        },
        {
            title: "Events",
            icon: <EventAvailableIcon />,
            link: "/events",
            items: [{
                title: "News",
                icon: <FeedIcon />,
                link: "/news"
            },
            {
                title: "Announcement",
                icon: <AnnouncementIcon />,
                link: "/announcement"
            },
            {
                title: "Event",
                icon: <EventAvailableIcon />,
                link: "/event"
            },
        ]
        },
        {
            title: "Services",
            icon: <MedicalServicesIcon />,
            link: "/services",
            items: [
                {
                    title: "Request",
                    icon: <TelegramIcon/>,
                    link: "/services/request"
                },
                {
                    title: "Add Services",
                    icon: <EngineeringIcon/>,
                    link: "/services/addService"
                }
            ]
        },
        {
            title: "Reports",
            icon: <AssessmentIcon />,
            link: "/reports"
        },
        {
            title: "History",
            icon: <HistoryIcon />,
            link: "/history"
        },
        
    ]
