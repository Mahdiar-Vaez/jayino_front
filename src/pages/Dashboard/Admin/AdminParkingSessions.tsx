import { alpha, Avatar, Paper,Box, Typography, Stack, Tooltip, IconButton } from "@mui/material";
import ParkingSessions from "../../../Components/server/tables/ParkingSessionsDataGrid";
import theme from "../../../utils/theme/theme";
import { BarChart3 } from "lucide-react";

export default function AdminParkingSessions() {
  return (
    <Box sx={{        p: { xs: 1.5, sm: 2, md: 3 },width:{
      xs:'90svw',
      md:'auto'
    },
}}>
  
       <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                mb: 3,
                borderRadius: 4,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(
                  theme.palette.primary.dark,
                  0.95
                )} 100%)`,
                color: 'white',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 2,
                boxShadow: `0 10px 30px -5px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <BarChart3 size={24} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="700" letterSpacing="-0.5px">
                    وضعیت پاریکنگ
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                  آمار و ارقام رو به طور لحظه ای به دست بیاورید
                  </Typography>
                </Box>
              </Box>
              <Stack direction="row" spacing={1} sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}>
        
              </Stack>
            </Paper>
      <ParkingSessions />
    </Box>
  )
}
