# react-min

react-min is a command-line tool that helps you quickly create a new React project with a predefined template and install the necessary dependencies.

## Usage

To create a new React project, run the following command:

```
npx react-min app-name
```

Replace `app-name` with the desired name for your new React app. This command will create a new directory with the specified `app-name`, copy the files from the `template` folder, update the `package.json` file with the new app name, and install the required dependencies.

## Template

The `template` folder in this package contains the initial structure and files for your React project. This includes the basic configuration files, source code files, and the `package.json` file with the default dependencies.

## Dependencies

The following dependencies are installed by default in the new React project:

- `react`
- `react-dom`
- `react-scripts`

You can add or remove dependencies as needed after the project is created.

## No Test Support

**Warning:** This package does not include any test setup or configuration. If you need to write tests for your React components, you will need to set up a testing framework (e.g., Jest) and any necessary utilities manually.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).