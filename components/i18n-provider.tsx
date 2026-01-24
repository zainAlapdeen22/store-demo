"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { dictionary, Dictionary, Language } from "@/lib/dictionaries";

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    dict: Dictionary;
    dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    useEffect(() => {
        const storedLang = localStorage.getItem("language") as Language;
        if (storedLang) {
            setLanguage(storedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = lang;
    };

    // Initial effect to set dir/lang on mount
    useEffect(() => {
        document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = language;
    }, [language]);

    return (
        <I18nContext.Provider
            value={{
                language,
                setLanguage: handleSetLanguage,
                dict: dictionary[language],
                dir: language === "ar" ? "rtl" : "ltr",
            }}
        >
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (context === undefined) {
        throw new Error("useI18n must be used within an I18nProvider");
    }

    if (!mounted) {
        return {
            ...context,
            language: "en",
            dict: dictionary["en"],
            dir: "ltr",
        };
    }

    return context;
}
