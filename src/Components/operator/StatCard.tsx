import { Box, Card, CardContent, LinearProgress, Typography } from "@mui/material";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  progress?: number; // برای نشان‌دادن پیش‌رفت (مثل ظرفیت)
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, progress }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        
        flexDirection: 'column',
        justifyContent: 'space-between',
        width:{xs:'80svw',sm:'300px'},
        alignContent:"center",
        borderLeft: `6px solid ${color}`,
        borderRadius: 2,
        boxShadow: 3,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            {value}
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        {progress !== undefined && (
          <Box mt={2}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {progress}% پر شده
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
export default StatCard