import React from 'react';

export default function DashboardMockup({ theme, variant = 'default' }) {
    const { colors } = theme;

    const isAlt = variant === 'alt';

    return (
        <div
            className={`w-full h-full rounded-xl  shadow-lg flex border border-gray-100 ${isAlt ? 'flex-col' : 'flex-row'}`}
            style={{ backgroundColor: colors.background.base, color: colors.text.base }}
        >
            {/* Alt Header (Top Nav) */}
            {isAlt && (
                <div
                    className="h-14 w-full flex items-center justify-between px-6 shadow-sm z-10"
                    style={{ backgroundColor: colors.surface.base }}
                >
                    {/* Left section */}
                    <div className="flex flex-col justify-center gap-1">
                        {/* Outer blue box */}
                        <div
                            className="relative h-6 w-24 rounded shadow-inner flex items-center justify-center"
                            style={{ backgroundColor: colors.primary.base }}
                        >
                            {/* Inner gray box */}
                            <div
                                className="h-2 w-12 rounded-sm opacity-20"
                                style={{ backgroundColor: colors.surface.base }}
                            />
                        </div>
                    </div>

                    {/* Right section */}
                    <div className="flex flex-1 justify-around">
                        {[1, 2, 3].map(i => (
                            <div
                                key={i}
                                className="h-2 w-12 rounded-full opacity-20"
                                style={{ backgroundColor: colors.text.base }}
                            />
                        ))}
                    </div>
                </div>

            )}

            {/* Default Sidebar */}
            {!isAlt && (
                <div
                    className="w-16 md:w-24 flex flex-col p-4 gap-4"
                    style={{ backgroundColor: colors.surface.base }}
                >
                    <div className="flex flex-col gap-2 mt-4">
                        {[1, 2, 3, 4].map(i => (
                            <div
                                key={i}
                                className={`h-8 rounded-lg w-full flex items-center px-2 ${i === 1 ? 'opacity-100' : 'opacity-20'}`}
                                style={{ backgroundColor: i === 1 ? colors.primary.base : 'transparent', color: i === 1 ? colors.primary.text : 'inherit' }}
                            >
                                <div className="w-4 h-4 rounded-full bg-current opacity-50 mr-2" />
                                <div className="w-16 h-2 rounded-full bg-current opacity-50 hidden md:block" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col gap-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                    <div className="h-6 w-32 rounded-lg opacity-20" style={{ backgroundColor: colors.text.base }} />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map(i => (
                        <div
                            key={i}
                            className="rounded-xl p-3 flex flex-col gap-2 shadow-sm"
                            style={{ backgroundColor: colors.surface.base }}
                        >
                            <div className="w-6 h-6 rounded opacity-20" style={{ backgroundColor: colors.primary.base }} />
                            <div className="w-full h-1 rounded opacity-10" style={{ backgroundColor: colors.text.base }} />
                        </div>
                    ))}
                </div>

                {/* Big Chart Area */}
                <div
                    className="flex-1 rounded-xl p-4 flex items-end gap-2"
                    style={{ backgroundColor: colors.surface.base }}
                >
                    {[30, 50, 45, 70, 60, 85, 40].map((h, i) => (
                        <div
                            key={i}
                            className="flex-1 rounded-t-lg transition-all"
                            style={{
                                height: `${h}%`,
                                backgroundColor: i === 5 ? colors.accent.base : i % 2 ? colors.primary.base : colors.secondary.base,
                                opacity: i === 5 ? 1 : 0.7
                            }}
                        />
                    ))}
                </div>


            </div>
        </div>
    );
}
