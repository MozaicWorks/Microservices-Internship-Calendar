# Week 2: Testing and Documentation

## 🎯 Learning Objectives
- Implement comprehensive unit testing strategies
- Add OpenAPI/Swagger documentation
- Configure Spring Boot profiles for different environments
- Enhance error handling and validation
- Improve the web interface with better UX

## 📋 What You'll Build
Enhanced monolithic application with:
- Complete unit test suite with high coverage
- OpenAPI/Swagger API documentation
- Multiple Spring Boot profiles (dev, test, prod)
- Comprehensive error handling
- Enhanced web interface with better user feedback

## 🚀 Getting Started

### 1. Prerequisites Check
Ensure you completed Week 1 successfully

### 2. Project Setup
```bash
# Navigate to week 2 directory
cd week-2-testing-and-documentation

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Run tests
mvn test
```

### 3. Access the Application
- **Web Interface**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/v3/api-docs

## 📚 Day-by-Day Instructions

### Day 1: API Documentation and Configuration
1. Add OpenAPI/Swagger dependencies
2. Configure OpenAPI documentation
3. Set up Spring Boot profiles
4. Add external configuration support
5. Test different profiles

### Day 2: Unit Testing and Error Handling
1. Create comprehensive unit tests
2. Add global exception handling
3. Implement input validation
4. Enhance UI error handling
5. Add test coverage reporting

## 🧪 Testing Your Implementation

### Test Coverage Goals
- Service layer: >90% coverage
- Controller layer: >80% coverage
- Repository layer: >70% coverage
- Overall project: >80% coverage

### Manual Testing Checklist
- [ ] Swagger UI loads and shows all endpoints
- [ ] All API endpoints documented with examples
- [ ] Application works in different profiles
- [ ] Unit tests pass with good coverage
- [ ] Error handling works properly
- [ ] UI shows user-friendly error messages

## 🎯 Success Criteria
By the end of Week 2, you should have:
- ✅ Complete OpenAPI/Swagger documentation
- ✅ Unit test suite with >80% coverage
- ✅ Multiple Spring Boot profiles working
- ✅ Comprehensive error handling
- ✅ Enhanced UI with better UX

## ➡️ Next Week
[Week 3: Service Extraction](../week-3-service-extraction/)
