export function Footer2() {
    return (
        <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© <a href="https://opnstudio.com/" className="hover:underline">OPN Studio</a> All Rights Reserved</span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <a href="Aviso_legal.pdf" target="_blank" className="hover:underline md:me-6">Aviso Legal</a>
                    </li>
                    <li>
                        <a href="Condiciones_Generales.pdf" target="_blank" className="hover:underline md:me-6">Condiciones Generales</a>
                    </li>
                    <li>
                        <a href="Politica_Cookies.pdf" target="_blank" className="hover:underline md:me-6">Política de Cookies</a>
                    </li>
                    <li>
                        <a href="Politica_Privacidad.pdf" target="_blank" className="hover:underline">Política de Privacidad</a>
                    </li>
                </ul>
            </div>
        <style jsx>{`
            ul li:not(:last-child) {
                margin-right: 1rem;
            }
        `}</style>
        </footer>
    );
}
