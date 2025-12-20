import React from "react";
import { Calculator, BookOpen, Sparkles, Brain, FileQuestionIcon } from "lucide-react";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">

            {/* Header */}
            <header className="px-4 sm:px-6 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="clay-element bg-gradient-to-r from-purple-100 to-blue-100 p-4 md:p-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="clay-element bg-gradient-to-br from-purple-200 to-blue-200 p-3 md:p-4">
                                    <Calculator className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Color Explorer</h1>
                                    <p className="text-sm md:text-base text-purple-600 font-medium">Interactive HSL color spectrum</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 self-end md:self-center">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                <span className="text-sm text-gray-600">In HTML, a color can be specified using <b>HSL(Hue, Saturation, Lightness)</b> value.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-4 sm:px-6 pb-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="px-4 sm:px-6 py-8 mt-4">
                <div className="max-w-6xl mx-auto">
                    <div className="clay-element bg-gradient-to-r from-green-100 to-blue-100 p-6">
                        <div className="flex items-center gap-4">
                            {/* <Brain className="w-5 h-5 text-green-600" /> */}
                            <span className="text-gray-700" >Discover the beauty of color</span>
                            <FileQuestionIcon className="w-5 h-5 text-blue-600" /> <span className="text-blue-600"><a href="https://www.w3schools.com/css/css_colors_hsl.asp" target="_blank">HTML HSL Colors</a></span>
                            <FileQuestionIcon className="w-5 h-5 text-blue-600" /> <span className="text-blue-600"><a href="https://oklch.com" target="_blank">Why OKLCH is better</a></span>
                            <FileQuestionIcon className="w-5 h-5 text-blue-600" /> <span className="text-blue-600"><a href="https://www.w3.org/TR/SVG11/types.html#ColorKeywords" target="_blank">Color names</a></span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
