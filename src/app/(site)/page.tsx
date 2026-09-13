import CalculatorSection from '@/components/layout/section/CalculatorSection'
import DatasheetSection from '@/components/layout/section/DatasheetSection'
import DocumentationSection from '@/components/layout/section/DocumentationSection'
import SchemesSection from '@/components/layout/section/SchemesSection'
import TheorySection from '@/components/layout/section/TheorySection'

// throw new Error
export default function HomePage() {
	return (
		<>
			<main className='content'>
				<DatasheetSection />
				<TheorySection />
				<DocumentationSection />
				<CalculatorSection />
				<SchemesSection />
			</main>
		</>
	)
}
