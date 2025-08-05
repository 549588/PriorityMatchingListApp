# Priority Matching List Application

A modern ASP.NET Core 8.0 MVC application for managing employee service orders and priority matching with a professional, responsive user interface.

## Features

### 🔐 Authentication & Authorization
- Employee-based login system
- Role-based access control for service orders
- Secure session management

### 📋 Service Order Management
- View assigned service orders by employee
- Priority-based matching system
- Service order filtering and authorization
- Interview scheduling and redirects

### 🎨 Modern UI/UX
- Professional gradient-based design
- Responsive layout with Bootstrap 5
- Modern card-based interface
- Optimized spacing and typography
- Font Awesome icons integration

### 🔧 Technical Features
- Entity Framework Core 8.0 with SQL Server
- Raw SQL queries for optimized performance
- Comprehensive logging with ILogger
- Modern CSS framework with animations
- Clean architecture with MVC pattern

## Technology Stack

- **Framework**: ASP.NET Core 8.0 MVC
- **Database**: Entity Framework Core 8.0.7 with SQL Server
- **Frontend**: Bootstrap 5, Modern CSS, Font Awesome
- **Authentication**: ASP.NET Core Identity
- **Logging**: Built-in ILogger

## Project Structure

```
PriorityMatchingListApp/
├── Controllers/
│   ├── AuthController.cs          # Authentication logic
│   ├── ServiceOrderController.cs  # Service order management
│   └── HomeController.cs          # Home page logic
├── Models/
│   ├── Employee.cs                # Employee entity
│   ├── ServiceOrder.cs            # Service order entity
│   └── InterviewScheduleRedirect.cs # Interview redirect model
├── Views/
│   ├── Home/
│   │   └── Index.cshtml           # Home page
│   ├── ServiceOrder/
│   │   ├── Index.cshtml           # Service orders list
│   │   └── PriorityList.cshtml    # Priority matching
│   └── Shared/
│       └── _Layout.cshtml         # Main layout
├── wwwroot/
│   └── css/
│       └── site.css               # Modern styling
└── Data/
    └── ApplicationDbContext.cs    # EF Core context
```

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- SQL Server or SQL Server Express
- Visual Studio 2022 or VS Code

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd PriorityMatchingListApp
```

2. Update the connection string in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=PriorityMatchingDb;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

3. Run database migrations:
```bash
dotnet ef database update
```

4. Build and run the application:
```bash
dotnet build
dotnet run
```

5. Navigate to `https://localhost:5002` or `http://localhost:5001`

## Key Features Implemented

### ✅ Authentication System
- Employee login with ID and password
- Secure session management
- User context throughout the application

### ✅ Service Order Authorization
- Employee-specific service order visibility
- Authorized employee list: [101, 102, 103, 104]
- Proper filtering without fallback exposure

### ✅ Modern UI Design
- Professional gradient styling
- Compact, space-optimized layout
- Responsive design for all screen sizes
- Modern card-based components

### ✅ Database Integration
- Entity Framework Core with SQL Server
- Raw SQL queries for complex operations
- Proper data type mappings
- Comprehensive logging

## Database Schema

### Key Tables
- **Employee**: Employee information and hierarchy
- **ServiceOrder**: Service order details and assignments
- **Users**: Authentication credentials
- **PriorityMatchingList**: Priority scoring and matching
- **InterviewScheduleRedirect**: Interview scheduling data

### Key Relationships
- Employee → ServiceOrder (HiringManager)
- ServiceOrder → PriorityMatchingList
- Employee → Users (Authentication)

## Recent Updates

### UI/UX Improvements
- ✅ Reduced excessive spacing throughout the application
- ✅ Implemented modern gradient-based design
- ✅ Added professional card layouts and typography
- ✅ Hidden unnecessary navigation elements
- ✅ Optimized responsive design

### Functionality Fixes
- ✅ Fixed SQL casting errors (Boolean/Int32/Decimal type mismatches)
- ✅ Implemented proper service order authorization
- ✅ Removed redundant UI messages
- ✅ Added comprehensive logging for debugging

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.

---

**Priority Matching List Application** - Modern, Professional, Efficient ✨
