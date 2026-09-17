namespace EmployeeManagement.Application.DTOs.Attendance;

public class AttendanceSummaryDto
{
    public DateTime Date { get; set; }
    public int TotalEmployees { get; set; }
    public int PresentCount { get; set; }
    public int AbsentCount { get; set; }
    public int LeaveCount { get; set; }
    public int HalfDayCount { get; set; }
    public double AttendanceRatePercentage => TotalEmployees == 0 ? 0 : Math.Round(((double)(PresentCount + (HalfDayCount * 0.5)) / TotalEmployees) * 100, 1);
}
