const getEnvVar = (key: string, defaultValue: string = ""): string => {
  if (typeof window !== "undefined") {
    // tslint:disable-next-line: no-string-literal
    return window?.["env"]?.[key] ?? defaultValue;
  }

  return process.env[key] ?? defaultValue;
};

export const defaultLang = "cs-CZ";

export const backendApiBase = getEnvVar(
  "BACKEND_API_URL",
  "https://api.battlebakers.cz"
);

export const graphqlBase = "http://localhost:5000/graphql";

export const discordUrl = "https://discord.com/channels/707920511509987348";
