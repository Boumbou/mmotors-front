export default function NoResult() {
    return (
        <div className="flex flex-col items-center gap-0">
            <img src="/NoResult.png" alt="Aucun résultat" className="flex min-w-90 h-100 max-w-150" />
            <p className="flex text-lg text-center">Aucun résultat trouvé </p>
        </div>
    )
}