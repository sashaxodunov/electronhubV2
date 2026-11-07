import 'server-only'

import { and, asc, eq, inArray, ne } from 'drizzle-orm'

import { db } from '@/db'
import { documentation } from '@/db/schema/documentation'
import { equipmentDocumentation } from '@/db/schema/equipment-documentation'

export async function getPublishedDocumentationByEquipmentIds(
  equipmentIds: bigint[],
  excludeDocumentationId: bigint,
) {
  if (equipmentIds.length === 0) {
    return []
  }

  return db
    .select({
      equipmentId: equipmentDocumentation.equipmentId,
      id: documentation.id,
      title: documentation.title,
      slug: documentation.slug,
      categorySlug: documentation.categorySlug,
      documentType: documentation.documentType,
      description: documentation.description,
      updatedAt: documentation.updatedAt,
      relationType: equipmentDocumentation.relationType,
      sortOrder: equipmentDocumentation.sortOrder,
    })
    .from(equipmentDocumentation)
    .innerJoin(
      documentation,
      eq(equipmentDocumentation.documentationId, documentation.id),
    )
    .where(
      and(
        inArray(equipmentDocumentation.equipmentId, equipmentIds),
        eq(documentation.status, 'published'),
        ne(documentation.id, excludeDocumentationId),
      ),
    )
    .orderBy(
      asc(equipmentDocumentation.sortOrder),
      asc(documentation.title),
    )
}
