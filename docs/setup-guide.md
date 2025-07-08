# Development Environment Setup Guide

This guide helps you set up your development environment for the Microservices Learning Program.

## Prerequisites

### Required Software
- **Java 17 or higher**
- **Maven 3.6+**
- **Docker & Docker Compose**
- **Git**
- **IDE** (IntelliJ IDEA recommended, but Eclipse or VS Code work too)

### Optional Tools
- **Postman** or **Insomnia** for API testing
- **Docker Desktop** for easier container management

## Installation Instructions

### Java 17
```bash
# On macOS with Homebrew
brew install openjdk@17

# On Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# On Windows
# Download from https://adoptium.net/
```

### Maven
```bash
# On macOS with Homebrew
brew install maven

# On Ubuntu/Debian
sudo apt install maven

# On Windows
# Download from https://maven.apache.org/download.cgi
```

### Docker
Visit https://docs.docker.com/get-docker/ for installation instructions for your platform.

## IDE Setup

### IntelliJ IDEA
1. Install IntelliJ IDEA Community Edition
2. Install plugins:
   - Spring Boot
   - Docker
   - Database Navigator

### VS Code
1. Install VS Code
2. Install extensions:
   - Extension Pack for Java
   - Spring Boot Extension Pack
   - Docker

## Verification

Run these commands to verify your setup:

```bash
java --version
mvn --version
docker --version
docker-compose --version
git --version
```

## Troubleshooting

### Common Issues
1. **Java_HOME not set**: Ensure JAVA_HOME environment variable points to your Java installation
2. **Maven not found**: Add Maven bin directory to your PATH
3. **Docker permission issues**: Add your user to the docker group (Linux/macOS)
4. **Port conflicts**: Default ports used: 8080, 8081, 8082, 8083, 8084, 5432, 5672

### Getting Help
If you encounter issues:
1. Check the troubleshooting section in each week's README
2. Search for solutions in the Issues section of this repository
3. Create a new issue with detailed error messages
