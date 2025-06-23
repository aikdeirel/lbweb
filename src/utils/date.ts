export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export function sortByDateDescending<T extends { happened: string }>(items: T[]): T[] {
    return [...items].sort((a, b) => 
        new Date(b.happened).getTime() - new Date(a.happened).getTime()
    );
}